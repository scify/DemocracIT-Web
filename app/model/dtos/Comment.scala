package model.dtos

import model.dtos.CommentSource.CommentSource
import org.joda.time.DateTime

case class Comment( id:Long,
                     articleId:Int,
                     source:CommentSource,
                     body:String,
                     userId:Int,
                     fullName:String,
                     dateAdded:DateTime,
                     revision:Int,
                     depth:String,
                     annotations:List[Annotation],
                     discussionThread: Option[DiscussionThread]
                    )
