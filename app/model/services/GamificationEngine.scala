package model.services

import java.util.UUID
import javax.inject.Inject

import model.repositories.GamificationRepository
import model.services.rewardRules.RewardRuleTrait


class GamificationEngine @Inject()(val rules: Set[RewardRuleTrait] ) extends GamificationEngineTrait{

  override def rewardUser(user_id: UUID,action_id:Int,  relatedData:Any): Int = {
    val gamificationRepository = new GamificationRepository
    val rule = this.rules.filter(p=> p.action_id == action_id)

    if (rule.size>1)
    {

    }
    var userThatPerfrormedAction:Any = null
    var itemId:Any = null
    if(relatedData.isInstanceOf[UUID]) {
      userThatPerfrormedAction = relatedData
      gamificationRepository.savePoints(user_id, action_id, rule.head.getPoints(user_id), userThatPerfrormedAction)
    } else if(relatedData.isInstanceOf[Long]) {
      itemId = relatedData
      gamificationRepository.savePoints(user_id, action_id, rule.head.getPoints(user_id), itemId)
    } else {
      gamificationRepository.savePoints(user_id, action_id, rule.head.getPoints(user_id), None)
    }
    0
  }
}
