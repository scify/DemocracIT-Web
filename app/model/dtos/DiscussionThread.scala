package model.dtos

case class DiscussionThread(var id:Long,
                            discussionThreadClientId:String,
                            text:String,
                            numberOfComments:Option[Int])

