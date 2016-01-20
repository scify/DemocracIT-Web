package model.services.rewardRules

import java.util.UUID

import model.services.GamificationEngineTrait


class RewardRule_RateLaw() extends RewardRuleTrait{

  override val action_id: Int = GamificationEngineTrait.RATE_LAW
  override def getPoints(user_id: UUID): Int = {
    2
  }
}
