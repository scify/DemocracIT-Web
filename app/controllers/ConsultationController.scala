package controllers

import java.io.File
import java.util.UUID
import javax.inject.Inject

import com.mohiva.play.silhouette.api.{Environment, Silhouette}
import com.mohiva.play.silhouette.impl.authenticators.CookieAuthenticator
import com.mohiva.play.silhouette.impl.providers.SocialProviderRegistry
import model.dtos._
import model.services._
import org.apache.pdfbox.pdmodel.PDDocument
import org.apache.pdfbox.util.PDFTextStripper
import play.api.cache.Cached
import play.api.i18n.MessagesApi
import play.api.libs.json.{JsValue, Json, Writes}
import play.api.mvc._
import utils.MailService


class ConsultationController  @Inject() (val cached: Cached, val messagesApi: MessagesApi,
                                         val env: Environment[User, CookieAuthenticator],
                                         socialProviderRegistry: SocialProviderRegistry,
                                         val gamificationEngine:GamificationEngineTrait, mailService: MailService)

  extends Silhouette[User, CookieAuthenticator] {

  private val consultationManager = new ConsultationManager(gamificationEngine)
  private val commentManager = new AnnotationManager(gamificationEngine, mailService)
  private val reporterManager = new ReporterManager()

  def displayAll() = //cached("displayall") {
    Action { implicit request => {
      val results: List[Consultation] = consultationManager.search(new ConsultationSearchRequest(-1, "", -1))

      implicit object Consultatites extends Writes[Consultation] {
        override def writes(c: Consultation): JsValue = Json.arr(
          (if (c.isActive) messagesApi("endsIn") + ":" else messagesApi("endsIn") + ": ") + c.endDateFormatted,
          "<a href='/consultation/" + c.id + "'>" + c.title + "</a>",
          c.articlesNum.toString + (if (c.articlesNum == 1) " " + messagesApi("article.singular") else " " + messagesApi("article.plural"))
        )
      }
      Ok(views.html.consultation.search("", Json.toJson(results), results.length, getConsultationsSearchMessages(messagesApi)))
    }
    }

  def getConsultationsSearchMessages(messages: MessagesApi):String = {
    val messageList:Map[String,String] = Map(
      "end" -> messages("end"),
      "title" -> messages("title"),
      "search" -> messages("search"),
      "firstPage" -> messages("consultations.search.firstPage"),
      "lastPage" -> messages("consultations.search.lastPage"),
      "previousPage" -> messages("consultations.search.previousPage"),
      "nextPage" -> messages("consultations.search.nextPage"),
      "editMsg" -> messages("consultations.search.editMsg"),
      "perPage" -> messages("consultations.search.perPage"),
      "noRecords" -> messages("consultations.search.noRecords"),
      "showing" -> messages("consultations.search.showing"),
      "from" -> messages("consultations.search.from"),
      "to" -> messages("consultations.search.to"),
      "records" -> messages("consultations.search.records"),
      "sortedBy" -> messages("consultations.search.sortedBy"),
      "totalRecords" -> messages("consultations.search.totalRecords"),
      "ended" -> messages("ended"),
      "articlePlural" -> messages("article.plural"),
      "all" -> messages("consultations.search.all")
    )
    Json.toJson(messageList).toString()
  }
  //}

  def parsePdfContent(filePath:String):String = {
    var document:PDDocument = new PDDocument()
    document = PDDocument.load(new File(filePath))
    document.getClass()
    var pdfContent = ""
    if( !document.isEncrypted() ) {
      val Tstripper:PDFTextStripper = new PDFTextStripper()
      //fileContent  = Tstripper.getText(document);
      for (a <- 1 to document.getNumberOfPages()) {
        Tstripper.setStartPage(a)
        Tstripper.setEndPage(a)
        pdfContent += Tstripper.getText(document) + "<br><br><br>"

      }
    } else {
      sys.error("File encrypted")
    }
    pdfContent
  }

  def formatFileContent(fileContent:String):String = {
    val lines:Array[String] = fileContent.split("\n")
    var fileContentFinal = ""
    var isFirstArticle = true
    var htmlContent = ""
    var articleNum = 1
    //for each line in the document
    for(line <- lines){
      if(line.length > 6) {
        if (line.substring(0, 6).equals("Άρθρο ")) {
          if(isFirstArticle) {
            htmlContent = "<div class=\"finalLawUploadedContent\"><div data-id=" + articleNum + "  class=\"row article\">" +
              "<div class=\"col-md-12\"><div class=\"title\">" +
              "<a class=\"show-hide btn collapsed\" data-toggle=\"collapse\" data-target=\"#finalLawUploadedBody-" + articleNum + "\"" +
              "><span>" + messagesApi("close") + "</span><span>" + messagesApi("open") + "</span></a><span class=\"article-title\">"
            isFirstArticle = false
          } else {
            htmlContent = "</div></div></div></div><div data-id=" + articleNum + "  class=\"row article\">" +
              "<div class=\"col-md-12\"><div class=\"title\">" +
              "<a class=\"show-hide btn collapsed\" data-toggle=\"collapse\" data-target=\"#finalLawUploadedBody-" + articleNum + "\"" +
              "><span>" + messagesApi("close") + "</span><span>" + messagesApi("open") + "</span></a><span class=\"article-title\">"
          }
          //htmlContentAfter contains the HTML div after the article title, preceding the article body
          val htmlContentAfter = "</span></div><div id=\"finalLawUploadedBody-" + articleNum + "\" class=\"collapse\" style=\"height:0;\" ><div class=\"article-body\">"
          //augment the article counter
          articleNum += 1
          fileContentFinal += htmlContent + line + htmlContentAfter
        } else{
            //check if line ends with "-"
            if(line.charAt(line.length-1) == 8722 || line.charAt(line.length-1) == 45 ) {
              fileContentFinal += line.substring(0, line.length-1)
            } else if (line.contains(". ")) {
                fileContentFinal += line + "<br>"
            }
            else {
              fileContentFinal += line
            }
        }
      } else {
          fileContentFinal += line
      }
    }
    //if isFirstArticle is true, it means that the file is in icorrect format. So we dont need to close any divs.
    if(!isFirstArticle)
      fileContentFinal += "</div></div></div></div></div>"
    fileContentFinal
  }

  def uploadFinalLaw(consultationId: Long, userId: java.util.UUID) = Action(parse.multipartFormData) { request =>
    request.body.file("file").map { finalLawFile =>
      import java.io.File

      val extension = finalLawFile.filename.substring(finalLawFile.filename.lastIndexOf("."))
      val timestamp = System.currentTimeMillis / 1000
      var fileContent = ""
      var fileContentFinal = ""
      val path = "public/files/finalLaw_" + consultationId + "_" + timestamp + extension
      finalLawFile.ref.moveTo(new File(path))
      if(extension.equals(".txt")) {
        fileContent = scala.io.Source.fromFile("public/files/finalLaw_" + consultationId + "_" + timestamp + extension).mkString
      } else if (extension.equals(".pdf")) {
        val filePath = "public/files/finalLaw_" + consultationId + "_" + timestamp + extension
        fileContent = parsePdfContent(filePath)
      }
      /*Get and format each line from the law file content*/
      fileContentFinal = formatFileContent(fileContent)
      storeFinalLawInDB(consultationId, path, fileContentFinal, userId)
      this.gamificationEngine.rewardUser(userId, GamificationEngineTrait.UPLOAD_FILE_ACTION_ID, None)
      Ok("File uploaded")
    }.getOrElse {
      Redirect("/").flashing(
        "error" -> "Missing file"
      )
    }
  }

  def rateFinalLaw(userId:UUID, consultationId: Long, finalLawId: Long, attitude: Int, liked:Boolean) = Action { implicit request =>
      consultationManager.rateFinalLaw(userId, consultationId, finalLawId, attitude, liked)
      Created("")
  }

  def deleteFinalLaw(finalLawId: Long, userId:UUID) = Action { implicit request =>
    consultationManager.deleteFinalLaw(finalLawId, userId)
    Created("")
  }


  def storeFinalLawInDB(consultationId: Long, finalLawPath: String, finalLawText: String, userId: java.util.UUID) {
      consultationManager.storeFinalLawInDB(consultationId, finalLawPath, finalLawText, userId)
  }

  def getConsultationWordCloud(consultationId :Long )= Action {  implicit request =>
    {
      val results = consultationManager.getConsultationWordCloud(consultationId)
      Ok(results)
    }
  }

  def search(query:String,ministryId:Option[Int] )= Action {  implicit request =>
    {
      val results:List[Consultation] = consultationManager.search(new ConsultationSearchRequest(-1,query,-1))
      import utils.ImplicitReadWrites._
      Ok(Json.toJson(results))
    }
  }

  def getConsultation(consultationId :Long) = UserAwareAction { implicit request =>
        val e = env
        Ok(views.html.consultation.index(consultationManager.get(consultationId, request.identity)))
  }

  def getAnnotatorPage(consultationId :Long) = UserAwareAction { implicit request =>
    Ok(views.html.consultation.index(consultationManager.get(consultationId, request.identity)))
  }
  
  def getReporterPage(consultationId :Long) = UserAwareAction { implicit request =>
        Ok(views.html.consultation.reporter(reporterManager.get(consultationId, request.identity)))
  }

  def getComments(consultationId:Long,
                   articleId:Long,
                   source: String ,
                   discussionthreadid:Option[Int] ,
                   discussionthreadclientid:String,
                   page:Option[Int]
                   ) = UserAwareAction {  implicit request =>

    import utils.ImplicitReadWrites._

    val comments = commentManager.getComments(consultationId,articleId,
                                              source,
                                              discussionthreadid,
                                              discussionthreadclientid,
                                              if (request.identity.isDefined) Some(request.identity.get.userID) else None)
    Ok(Json.toJson(comments))
  }
}
