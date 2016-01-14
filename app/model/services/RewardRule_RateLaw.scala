package model.services

import java.util.UUID


class RewardRule_RateLaw() extends RewardRuleTrait{

  override val action_id: Int = GamificationEngineTrait.RATE_LAW
  override def getPoints(user_id: UUID): Int = {
    2
  }
}
