package model.dtos

import java.util.{UUID, Date, Locale, Calendar}

import model.dtos.CommentSource.CommentSource
import org.joda.time.{Period,Days, DateTime}
import org.ocpsoft.prettytime.PrettyTime

case class Comment(var id:Option[Long],
                       articleId:Long,
                       source:CommentSource,
                       body:String, //what user wrote in the comment
                       userAnnotatedText:Option[String], //what the user selected from the text
                       userId: Option[UUID],
                       fullName:String,
                       dateAdded:Date,
                       revision:Int,
                       depth:String,
                       var annotationTags:List[AnnotationTags], //list of tags that user selected for this comment
                       discussionThread: Option[DiscussionThread]
                    )
