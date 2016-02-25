package model.viewmodels

import model.dtos._
import org.apache.commons.lang3.StringUtils
import play.api.i18n.Messages
import play.api.libs.json._
import utils.ImplicitReadWrites._

import scala.collection.mutable.{ArrayBuffer, ListBuffer}

case class ReporterViewModel(consultation:model.dtos.Consultation,
                             user: Option[User],
                             relevantMaterials: Seq[RelevantMaterial],
                             commentsPerArticle:  Seq[Article],
                             annotationTagWithComments: Seq[AnnotationTagWithComments],
                             annotationTagPerArticleWithComments: Seq[AnnotationTagPerArticleWithComments],
                             relevantLaws: Seq[RelevantLaws],
                             userCommentStats: Seq[UserCommentStats],
                             finalLaw: Option[ConsultationFinalLaw],
                             ratingUsers: Seq[ConsFinalLawRatingUsers]
                              )
{
  def commentsPerArticleToJson():String =Json.toJson(commentsPerArticle).toString()
  def userCommentStatsToJson():String =Json.toJson(userCommentStats).toString()
  def annotationsForConsultationToJson(type_of_ann:Int):String =Json.toJson(getAnnotationsForConsultation(type_of_ann)).toString()
  def annotationsPerArticleToJson(type_of_ann:Int):String =Json.toJson(getAnnotationsPerArticle(type_of_ann)).toString()
  def ratingUsersToJson():String = Json.toJson(ratingUsers).toString()

  def getFinalLawRelativePath():String = {
    if(play.Play.application().configuration().getString("application.state") == "production")
      "http://democracit.org/" + finalLaw.get.file_path.replaceAll("public", "assets")
    else
      "http://localhost:9000/" + finalLaw.get.file_path.replaceAll("public", "assets")
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

  def getReporterMessages(messages: Messages):String = {
    val messageList:Map[String,String] = Map(
      "topicSingular" -> messages("reporter.topicSingular"),
      "commentsPlural" -> messages("reporter.commentsPlural"),
      "clickOnName" -> messages("reporter.clickOnName"),
      "commentsPerArticleTitle" -> messages("reporter.commentsPerArticleTitle"),
      "topicsTitle" -> messages("reporter.topicsTitle"),
      "problemsTitle" -> messages("reporter.problemsTitle"),
      "topicsPerArticleTitle" -> messages("reporter.topicsPerArticleTitle"),
      "problemsPerArticleTitle" -> messages("reporter.problemsPerArticleTitle"),
      "commentsNumberTitle" -> messages("reporter.commentsNumberTitle"),
      "articlesPlural" -> messages("reporter.articlesPlural"),
      "problemsSingular" -> messages("reporter.problemsSingular"),
      "articlesSingular" -> messages("reporter.articlesSingular")
    )
    Json.toJson(messageList).toString()
  }

  def totalComments:Int = {
    var total = 0
    for(article <- commentsPerArticle) {
      total += article.commentsNum
    }
    total
  }

  /*This function extracts the problems or reference tags from the Seq and returns the subset
  * type_of_ann is 1 or 2 (1 for reference tags, 2 for problem tags)*/
  def getAnnotationsForConsultation(type_of_ann:Int):Seq[AnnotationTagWithComments] = {
    val annotationProblemsArr = new ListBuffer[AnnotationTagWithComments]()
    for(annTag <- annotationTagWithComments) {
      if(annTag.annotationTag.type_id == type_of_ann) {
        val annTagWithCommentsTemp = AnnotationTagWithComments(annTag.annotationTag,annTag.numberOfComments)
        annotationProblemsArr += (annTagWithCommentsTemp)
      }
    }
    annotationProblemsArr.toList
  }


  def getAnnotationsPerArticle(type_of_ann:Int):Seq[AnnotationTagPerArticleWithComments] = {
    val annotationProblemsArr = new ListBuffer[AnnotationTagPerArticleWithComments]()
    for(annTag <- annotationTagPerArticleWithComments) {
      if(annTag.annotationTag.type_id == type_of_ann) {
        val annTagWithCommentsTemp = AnnotationTagPerArticleWithComments(annTag.annotationTag,annTag.article_name,annTag.article_id,annTag.numberOfComments)
        annotationProblemsArr += (annTagWithCommentsTemp)
      }
    }
    annotationProblemsArr.toList
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

