package model.viewmodels.forms

import play.api.data.Form
import play.api.data.Forms._


object RateCommentForm {

  val form = Form(
    mapping(
      "comment_id" -> longNumber,
      "liked" -> optional(boolean),
      "commenterId"->text,
      "annId"->text,
      "articleId"->longNumber,
      "consultationId"->longNumber
    )(RateCommentFormModel.apply)(RateCommentFormModel.unapply)
  )

  case class RateCommentFormModel(comment_id: Long,liked:Option[Boolean], commenterId: String, annId:String, articleId:Long, consultationId:Long)
}
