package model.services

import java.util.UUID
import javax.inject.Inject

import com.mohiva.play.silhouette.api.LoginInfo
import com.mohiva.play.silhouette.impl.providers.CommonSocialProfile
import model.User
import model.repositories._

import play.api.libs.concurrent.Execution.Implicits._

import scala.concurrent.Future


class GameEngine @Inject()() extends GameEngineTrait{




  override def rewardUser(user_id: UUID,action_id:Int): Int = {
    5
  }
}
