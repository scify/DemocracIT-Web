package model.services

import java.util.UUID
import javax.inject.Inject

import model.repositories.GamificationRepository


class GamificationEngine @Inject()(val rules: Set[RewardRuleTrait] ) extends GamificationEngineTrait{

  override def rewardUser(user_id: UUID,action_id:Int,  relatedData:Any): Int = {
    val gamificationRepository = new GamificationRepository
    val rule = this.rules.filter(p=> p.action_id == action_id)

    if (rule.size>1)
    {

    }

    gamificationRepository.savePoints(user_id, action_id, rule.head.getPoints(user_id))
    0
  }
}
