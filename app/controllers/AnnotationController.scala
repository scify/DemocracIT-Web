package controllers

import javax.inject.{Inject, Singleton}

import play.api.mvc._


class AnnotationController() extends Controller {
  def annotate(consultationid:Int, articleid:Int,tagsId:Int) = Action {
    Ok("not implemented")
  }
}