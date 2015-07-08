package model.dtos

case class Article( id: Long,
                    consultationId:Long,
                    title:String,
                    body:String,
                    order:Int,
                    commentsNum:Int);
