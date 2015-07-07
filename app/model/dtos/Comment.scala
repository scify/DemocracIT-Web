package model.dtos

import java.util.{Date, Locale, Calendar}

import model.dtos.CommentSource.CommentSource
import org.joda.time.{Period,Days, DateTime}
import org.ocpsoft.prettytime.PrettyTime

case class Comment( var id:Long,
                     articleId:Long,
                     source:CommentSource,
                     body:String,
                     userId:String,
                     fullName:String,
                     dateAdded:Date,
                     revision:Int,
                     depth:String,
                     annotations:List[AnnotationType],
                     discussionThread: Option[DiscussionThread]
                    )
