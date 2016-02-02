package model.services

import model.viewmodels.forms.SignUpForm.SignUpData
import play.api.Play.current
import play.api.i18n.Messages
import play.api.i18n.Messages.Implicits._
import play.twirl.api.Html
import utils.MailService

import scala.language.implicitConversions

object MailerManager {

  implicit def html2String (html: Html): String = html.toString

  def welcome(signUpData: SignUpData, link: String)(implicit mailService:MailService) {
    mailService.sendEmailAsync(signUpData.email)(
      subject = Messages("mail.welcome.subject"),
      bodyHtml = Messages("mail.welcome.body",link),
      bodyText = link
    )
  }

  def forgotPassword (email: String, link: String)(implicit mailService:MailService) {
    mailService.sendEmailAsync(email)(
      subject = Messages("mail.forgotpwd.subject"),
      bodyHtml = Messages("mail.forgotpwd.body", link),
      bodyText = link
    )
  }

  def sendEmailToCommenter (email: String, commentText:String, link: String)(implicit mailService:MailService) {
    mailService.sendEmailAsync(email)(
      subject = Messages("mail.replyToCommenter.subject"),
      bodyHtml = Messages("mail.replyToCommenter.body",commentText, link),
      bodyText = link
    )
  }

  def sendEmailToCommenterForLike (email: String, link: String)(implicit mailService:MailService) {
    mailService.sendEmailAsync(email)(
      subject = Messages("mail.replyToCommenterForLike.subject"),
      bodyHtml = Messages("mail.replyToCommenterForLike.body", link),
      bodyText = link
    )
  }

//  def forgotPasswordUnknowAddress (email: String)(implicit mailService:MailService) {
//
//    def getText()(implicit messages: Messages): String = {
//      views.html.account.unknownEmail.render(messages)
//    }
//
//    mailService.sendEmailAsync(email)(
//      subject = Messages("mail.forgotpwd.subject"),
//      bodyHtml = views.html.emails.unknownEmail.apply(),
//      bodyText = getText()
//    )
//  }
}
