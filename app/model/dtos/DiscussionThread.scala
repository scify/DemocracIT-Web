package model.dtos

case class DiscussionThread(id:BigInt,
                            from:Byte,
                            to:Byte,
                            body:String,
                            numberOfComments:Int,
                            numberOfAnnotations:Int) //a comment may have zero or more annotations attached

