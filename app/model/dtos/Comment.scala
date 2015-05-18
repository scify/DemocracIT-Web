package model.dtos

import org.joda.time.DateTime

case class Comment(id:BigInt,
                   articleId:BigInt,
                   source:CommentSource,
                   annotations:List[Annotation],
                   discussionThread: DiscussionThread,
                   dateAdded:DateTime,
                   revision:Int,
                   depth:Int
                    )
