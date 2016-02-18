package model.viewmodels

import model.dtos._
import org.apache.commons.lang3.StringUtils
import play.api.i18n.Messages
import play.api.libs.json._
import utils.ImplicitReadWrites._

import scala.collection.mutable.ArrayBuffer

case class ConsultationViewModel(consultation:model.dtos.Consultation,
                                 annotationsRelatedToProblems: Seq[AnnotationTags],
                                 annotationsRelatedToTopics: Seq[AnnotationTags],
                                 discussionThreads : Seq[DiscussionThread],
                                 user: Option[User],
                                 relevantMaterials: Seq[RelevantMaterial],
                                 relevantLaws: Seq[RelevantLaws],
                                 finalLaw: Option[ConsultationFinalLaw],
                                 ratingUsers: Seq[ConsFinalLawRatingUsers])
{
  private var _distinctLaws:Seq[RelevantLaws] = Nil

   //def annotationTypesToJson():String = Json.toJson(annotationsRelatedToProblems).toString()
  def discussionThreadsToJson():String =Json.toJson(discussionThreads).toString()
  def relevantLawsToJson():String =Json.toJson(this.distinctLaws(false)).toString()
  def ratingUsersToJson():String = Json.toJson(ratingUsers).toString()
  //we ned to change the directory of the file, because according to the routse file
  //everything that is stored in there should begin with "assets". So if the final law file is stored in
  //  public/files/file we need to cast it into /assets/files/file
  def getFinalLawRelativePath():String = {
    if(play.Play.application().configuration().getString("application.state") == "production")
      "http://democracit.org/" + finalLaw.get.file_path.replaceAll("public", "assets")
    else
      "http://localhost:9000/" + finalLaw.get.file_path.replaceAll("public", "assets")
  }
  def distinctLaws(ignoreCharacters:Boolean = true):Seq[RelevantLaws] = {

    if (_distinctLaws ==Nil)
      {
        val grouppingFunction =if (ignoreCharacters)
          (x:RelevantLaws) => x.entity_text.toLowerCase().replace(" ","").replace(".","")
        else
          (x:RelevantLaws) => x.entity_text.toLowerCase()

        _distinctLaws  =this.relevantLaws.groupBy(grouppingFunction).map(tuple => tuple._2.head).toList
      }

    _distinctLaws

  }


  def getGeneralMessages(messages: Messages):String = {
    val messageList:List[String] = List(messages("youCannotVoteFLMsg"),
      messages("deleteFLPrompt"),
      messages("uploadFLmsg"),
      messages("uploadFLWrongFile"),
      messages("uploadFLLoadingMsg")
    )
    Json.toJson(messageList).toString()
  }

  def getCommentBoxMessages(messages: Messages):String = {
    val messageList:List[String] = List(messages("commentBox.comments"),
      messages("commentBox.comment"),
      messages("commentBox.commentsForArticle"),
      messages("commentBox.commentsForText"),
      messages("commentBox.commentsFromOpengov"),
      messages("commentBox.mostPopularComments"),
      messages("commentBox.seeAllComments")
    )
    Json.toJson(messageList).toString()
  }

  def groupLaws():Seq[(String, Seq[RelevantLaws])]  = {

    val results:Seq[(String, Seq[RelevantLaws])] = this.relevantLaws.groupBy( law => law.entity_law.replace(" ","").replace(".","")).toList
    results
  }

  def findOccurances(lawName:String):Int = {
    var i = 0
    val lawNameStripped = lawName.toLowerCase().replace(" ","").replace(".","")
    for(law <- this.relevantLaws) {
      val lawStripped = law.entity_law.toLowerCase().replace(" ","").replace(".","")
      if(lawStripped == lawNameStripped) {
        i += 1
      }
    }
    i
  }

  def articlesOccurances(lawName:String):Int = {
    var articles = ArrayBuffer[String]()
    for(law <- this.relevantLaws) {

      if(!articles.contains(law.article_title) && lawName == law.entity_law.replace(" ","").replace(".","")) {
        articles += law.article_title
      }
    }
    articles.length
  }

  def articleNameTrimmed(articleName:String):String = {
    val trimmed = StringUtils.substringBefore(articleName, ":");
    trimmed
  }

}

