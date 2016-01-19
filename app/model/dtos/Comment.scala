package model.dtos

import java.util.{Date, UUID}

import model.dtos.CommentSource.CommentSource

/**
  * @param body what user wrote in the comment
  * @param userAnnotatedText what the user selected from the text
  * @param annotationTagProblems list of tags that user selected for this comment
  * @param loggedInUserRating None if user not logged, True if user liked the comment , false if he disliked it
  */
case class Comment(var id:Option[Long],
                   articleId:Long,
                   parentId:Option[Long],
                   source:CommentSource,
                   body:String,
                   userAnnotatedText:Option[String],
                   userId: Option[UUID],
                   fullName:String,
                   avatarUrl:Option[String],
                   var profileUrl:Option[String],
                   dateAdded:Date,
                   revision:Int,
                   depth:String,
                   var annotationTagProblems:List[AnnotationTags],
                   var annotationTagTopics:List[AnnotationTags],
                   discussionThread: Option[DiscussionThread],
                   likesCounter: Int,
                   dislikesCounter:Int,
                   loggedInUserRating: Option[Boolean],
                   commentReplies:List[Comment] = Nil
                  )


