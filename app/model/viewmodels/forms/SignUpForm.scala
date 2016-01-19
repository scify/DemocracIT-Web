package model.viewmodels.forms

import play.api.data.Form
import play.api.data.Forms._
import play.api.i18n.{MessagesApi, Messages}

/**
 * The form which handles the sign up process.
 */
object SignUpForm {

  /**
   * A play framework form.
   */
  val form = Form(
    mapping(
      "firstName" -> nonEmptyText,
      "lastName" -> nonEmptyText,
      "email" -> email,
      "password" -> nonEmptyText
    )
    (SignUpData.apply)(SignUpData.unapply)
  )

  /**
   * The form data.
   *
   * @param firstName The first name of a user.
   * @param lastName The last name of a user.
   * @param email The email of the user.
   * @param password The password of the user.
   */
  case class SignUpData(
                   firstName: String,
                   lastName: String,
                   email: String,
                   password: String)
}
