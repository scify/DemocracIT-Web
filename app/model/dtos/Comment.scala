package model.dtos

import java.util.{Date, Locale, Calendar}

import model.dtos.CommentSource.CommentSource
import org.joda.time.{Period,Days, DateTime}
import org.ocpsoft.prettytime.PrettyTime

case class Comment( var id:Long,
                     articleId:Int,
                     source:CommentSource,
                     body:String,
                     userId:Int,
                     fullName:String,
                     dateAdded:Date,
                     revision:Int,
                     depth:String,
                     annotations:List[Annotation],
                     discussionThread: Option[DiscussionThread]
                    )
