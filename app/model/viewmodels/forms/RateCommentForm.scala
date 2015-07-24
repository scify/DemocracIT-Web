package model.viewmodels.forms

import play.api.data.Form
import play.api.data.Forms._


object RateCommentForm {

  val form = Form(
    mapping(
      "comment_id" -> longNumber,
      "liked" -> optional(boolean)
    )(RateCommentFormModel.apply)(RateCommentFormModel.unapply)
  )

  case class RateCommentFormModel(comment_id: Long,liked:Option[Boolean])
}
