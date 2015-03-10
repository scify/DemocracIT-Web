package controllers

import javax.inject.{Inject, Singleton}

import play.api.mvc._


class AccountController  () extends Controller {

  def login = Action {

    Ok(views.html.account.login())
  }

  def postLogin = Action {
    Ok("not implemented")
  }

  def register= Action {
    Ok("not implemented")
  }

  def postRegister= Action {
    Ok("not implemented")
  }

}