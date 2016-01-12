package model.services

import java.util.UUID

/**
 * Handles actions to users.
 */
trait RewardRuleTrait {

  val action_id:Int
  def getPoints(user_id: UUID): Int
}

object RewardRuleTrait
{

}

