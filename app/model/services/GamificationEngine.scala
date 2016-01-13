package model.services

import java.util.UUID
import javax.inject.Inject


class GamificationEngine @Inject()(val rules: Set[RewardRuleTrait] ) extends GamificationEngineTrait{

  override def rewardUser(user_id: UUID,action_id:Int): Int = {
    5
  }
}
