package model.dtos

case class DiscussionThread(var id:Option[Long],
                            discussion_thread_type_id:Int, //whether the discussion thread refers to the whole article (1 for article part and 2 for whole article)
                            clientId:String, //id produced by javascript
                            text:String,
                            numberOfComments:Option[Int])

