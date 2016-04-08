package model.dtos

import java.util.{Date, UUID}

import model.dtos.CommentSource.CommentSource

case class ConsultationRssData(userName:String,consultation_id:Int,
                               consultation_title:String,
                               article_title:String,
                               article_id:Int,
                               discussionThreadTag:String,
                               discussionThreadTypeId:Int,
                               comment_id:BigInt,
                               comment_date:Date,
                               annotatedText:String,
                               comment:String) {
  def consultationShareUrl = "http://www.democracit.org/consultation/"+consultation_id+
    "#commentid="+ comment_id+"&articleid="+article_id+
    "&annid="+ discussionThreadTag.replace(article_id.toString ,"")
}

