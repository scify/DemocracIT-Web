package controllers

import javax.inject.Inject

import com.mohiva.play.silhouette.api.{Environment, Silhouette}
import com.mohiva.play.silhouette.impl.authenticators.CookieAuthenticator
import com.mohiva.play.silhouette.impl.providers.SocialProviderRegistry
import model.dtos._
import model.services._
import org.apache.pdfbox.pdmodel.PDDocument
import org.apache.pdfbox.util.{PDFTextStripper, PDFTextStripperByArea}
import play.api.cache.Cached
import play.api.i18n.MessagesApi
import play.api.libs.json.{JsValue, Json, Writes}
import play.api.mvc._



class ConsultationController  @Inject() (val cached: Cached ,val messagesApi: MessagesApi,
                                         val env: Environment[model.User, CookieAuthenticator],
                                         socialProviderRegistry: SocialProviderRegistry)
  extends Silhouette[model.User, CookieAuthenticator] {

  private val consultationManager = new ConsultationManager()
  private val commentManager = new AnnotationManager()
  private val reporterManager = new ReporterManager()

  def displayAll() = //cached("displayall") {
    Action { implicit request => {
      val results: List[Consultation] = consultationManager.search(new ConsultationSearchRequest(-1, "", -1))

      implicit object Consultatites extends Writes[Consultation] {
        override def writes(c: Consultation): JsValue = Json.arr(
          (if (c.isActive) "λήξη σε:" else "έληξε: ") + c.endDateFormatted,
          "<a href='/consultation/" + c.id + "'>" + c.title + "</a>",
          c.articlesNum.toString + (if (c.articlesNum == 1) " άρθρo" else " άρθρα")
        )
      }
      Ok(views.html.consultation.search("", Json.toJson(results), results.length))
    }
    }

  //}

  def uploadFinalLaw(consultationId: Long, userId: java.util.UUID) = Action(parse.multipartFormData) { request =>
    request.body.file("file").map { finalLawFile =>
      import java.io.File

      val extension = finalLawFile.filename.substring(finalLawFile.filename.lastIndexOf("."))
      var fileContent = ""
      val path = "public/files/finalLaw_" + consultationId + extension
      finalLawFile.ref.moveTo(new File(path))
      if(extension.equals(".txt")) {
        fileContent = scala.io.Source.fromFile("public/files/finalLaw_" + consultationId + extension).mkString
      } else if (extension.equals(".pdf")) {
        var document:PDDocument = new PDDocument()
        document = PDDocument.load(new File("public/files/finalLaw_" + consultationId + extension))
        document.getClass()
          if( !document.isEncrypted() ) {
            var stripper:PDFTextStripperByArea = new PDFTextStripperByArea()
            stripper.setSortByPosition( true )
            var Tstripper:PDFTextStripper = new PDFTextStripper()
            fileContent  = Tstripper.getText(document);
          }
        }
      storeFinalLawInDB(consultationId, path, fileContent, userId)
      Ok("File uploaded")
    }.getOrElse {
      Redirect("/").flashing(
        "error" -> "Missing file"
      )
    }
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
