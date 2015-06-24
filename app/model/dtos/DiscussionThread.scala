package model.dtos

case class DiscussionThread(id:Long,
                            from:Int,
                            to:Int,
                            body:String,
                            numberOfComments:Int,
                            numberOfAnnotations:Int) //a comment may have zero or more annotations attached

