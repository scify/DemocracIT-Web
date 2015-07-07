package model.dtos

case class DiscussionThread(var id:Option[Long],
                            discussionThreadClientId:String,
                            text:String,
                            numberOfComments:Option[Int])

