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
    val messageList:Map[String,String] = Map("youCannotVoteFLMsg" -> messages("youCannotVoteFLMsg"),
      "deleteFLPrompt" -> messages("deleteFLPrompt"),
      "uploadFLmsg" -> messages("uploadFLmsg"),
      "uploadFLWrongFile" -> messages("uploadFLWrongFile"),
      "uploadFLLoadingMsg" ->messages("uploadFLLoadingMsg")
    )
    Json.toJson(messageList).toString()
  }

  def getCommentBoxMessages(messages: Messages):String = {
    val messageList:Map[String,String] = Map(
      "commentsLabel" -> messages("commentBox.comments"),
      "commentLabel" -> messages("commentBox.comment"),
      "commentsForArticle" -> messages("commentBox.commentsForArticle"),
      "commentsForText" -> messages("commentBox.commentsForText"),
      "commentsFromOpengov" -> messages("commentBox.commentsFromOpengov"),
      "mostPopularComments" -> messages("commentBox.mostPopularComments"),
      "seeAllComments" -> messages("commentBox.seeAllComments"),
      "seeLabel" -> messages("commentBox.seeLabel"),
      "commentAfterConsEnd" -> messages("commentBox.commentAfterConsEnd"),
      "topics" -> messages("commentBox.topics"),
      "problems" -> messages("commentBox.problems"),
      "category" -> messages("commentBox.category"),
      "copyLink" -> messages("consultation.index.copylink"),
      "userHasEdited" -> messages("commentBox.userHasEdited"),
      "userEditPrompt" -> messages("commentBox.userEditPrompt"),
      "link" -> messages("commentBox.commentLink"),
      "commentLabelCapital" -> messages("commentBox.commentCapital"),
      "textPart" -> messages("commentBox.textPart"),
      "articleName" -> messages("commentBox.articleName"),
      "userEmotionLabel" -> messages("commentBox.userEmotionLabel"),
      "repliesLabel" -> messages("commentBox.repliesLabel"),
      "reportLabel" -> messages("commentBox.reportLabel"),
      "reply" -> messages("commentBox.reply"),
      "commentFLMatching" -> messages("commentBox.commentFLMatching"),
      "like" -> messages("commentBox.like"),
      "dislike" -> messages("commentBox.dislike"),
      "likeUsers" -> messages("commentBox.likeUsers"),
      "dislikeUsers" -> messages("commentBox.dislikeUsers"),
      "annPlaceholder" -> messages("annotation.comment.leavetext.placeholder"),
      "submitbtn" -> messages("submitbtn"),
      "signInTitle" -> messages("sign.in.title"),
      "notlogedintext" ->messages("notlogedintext", "<a href=\"/signIn\">", "</a>"),
      "reportCommentPrompt" ->messages("commentBox.reportCommentPrompt"),
      "reportCommentAlready" ->messages("commentBox.reportCommentAlready"),
      "reportCommentDone" ->messages("commentBox.reportCommentDone"),
      "reportCommentTitle" ->messages("commentBox.reportCommentTitle"),
      "reportCommentExpl" ->messages("commentBox.reportCommentExpl"),
      "reportCommentBtn" ->messages("commentBox.reportCommentBtn"),
      "closebtn" -> messages("closebtn"),
      "matchingNoAnn" -> messages("commentBox.matchingNoAnn"),
      "editMatching" -> messages("commentBox.editMatching"),
      "matchingPrompt" -> messages("commentBox.matchingPrompt"),
      "matchingNoLaw1" -> messages("commentBox.matching.noLaw1"),
      "here" -> messages("here"),
      "commentNotMatched" -> messages("commentBox.commentNotMatched"),
      "commentNotMatchedExpl" -> messages("commentBox.commentNotMatchedExpl"),
      "commentFLMatchingTitle" -> messages("commentBox.commentFLMatchingTitle"),
      "commentFLMatchingSeeUsersTitle" -> messages("commentBox.commentFLMatchingSeeUsersTitle")
    )
    Json.toJson(messageList).toString()
  }

  def getCommentAnnotatorMessages(messages: Messages):String = {
    val messageList:Map[String,String] = Map(
      "annTextTitle" -> messages("comment.Annotator.AnnTextTitle"),
      "forWholeArticle" -> messages("comment.Annotator.forWholeArticle"),
      "forTextPart" -> messages("comment.Annotator.forTextPart"),
      "editCommentLabel" -> messages("comment.Annotator.editCommentLabel"),
      "topicPrompt" -> messages("comment.Annotator.topicPrompt"),
      "topicExample" -> messages("comment.Annotator.topicExample")
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

