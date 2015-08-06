package model.dtos

import java.util.{UUID, Date, Locale, Calendar}

import model.dtos.CommentSource.CommentSource
import org.joda.time.{Period,Days, DateTime}
import org.ocpsoft.prettytime.PrettyTime

/**
 * @param body what user wrote in the comment
 * @param userAnnotatedText what the user selected from the text
 * @param annotationTagProblems list of tags that user selected for this comment
 * @param loggedInUserRating None if user not logged, True if user liked the comment , false if he disliked it
 */
case class Comment(var id:Option[Long],
                       articleId:Long,
                       source:CommentSource,
                       body:String,
                       userAnnotatedText:Option[String],
                       userId: Option[UUID],
                       fullName:String,
                       dateAdded:Date,
                       revision:Int,
                       depth:String,
                       var annotationTagProblems:List[AnnotationTags],
                       var annotationTagTopics:List[AnnotationTags],
                       discussionThread: Option[DiscussionThread],
                       likesCounter: Int,
                       dislikesCounter:Int,
                       loggedInUserRating: Option[Boolean]
                    )


