package model.dtos

case class DiscussionThread(var id:Option[Long],
                            clientId:String, //id produced by javascript
                            text:String,
                            numberOfComments:Option[Int])

