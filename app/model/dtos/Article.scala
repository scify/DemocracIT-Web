package model.dtos

case class Article(val id: Long,
              val consultationId:Long,
              val title:String,
              val body:String,
              val order:Int,
              val commentsNum:Int);
