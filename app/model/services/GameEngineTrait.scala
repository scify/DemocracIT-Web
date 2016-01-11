package model.services

import java.util.UUID

import com.mohiva.play.silhouette.api.services.IdentityService
import com.mohiva.play.silhouette.impl.providers.CommonSocialProfile
import model.User

import scala.concurrent.Future

/**
 * Handles actions to users.
 */
trait GameEngineTrait {
  def rewardUser(user_id: UUID, action_id:Int): Int
}

object GameEngineTrait
{
  val UPLOAD_FILE_ACTION_ID = 1
  val COMMENT_ON_CONSULTATION = 2
}

