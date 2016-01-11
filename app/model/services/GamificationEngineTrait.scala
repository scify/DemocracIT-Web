package model.services

import java.util.UUID

/**
 * Handles actions to users.
 */
trait GamificationEngineTrait {
  def rewardUser(user_id: UUID, action_id:Int): Int
}

object GamificationEngineTrait
{
  val UPLOAD_FILE_ACTION_ID = 1
  val COMMENT_ON_CONSULTATION = 2
}

