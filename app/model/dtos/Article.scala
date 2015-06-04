package model.dtos

case class Article(val id: BigInt,
              val consultationId:BigInt,
              val title:String,
              val body:String,
              val order:Int,
              val commentsNum:Int);
