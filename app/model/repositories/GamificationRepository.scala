package model.repositories

import java.util.UUID

import _root_.anorm._
import play.api.Play.current
import play.api.db.DB


class GamificationRepository {

  def savePoints(userId:UUID, actionId:Int, points:Int, relatedData:Any):Unit = {
    DB.withConnection { implicit c =>
      if(relatedData.isInstanceOf[UUID]) {
        val relatedUserId = relatedData.asInstanceOf[UUID]
        SQL"""
            INSERT INTO user_awards (user_id, action_id, date_added, points, related_data)
            values (CAST($userId AS UUID), $actionId, now(), $points, CAST($relatedUserId AS UUID))""".execute()
      } else {
        SQL"""
            INSERT INTO user_awards (user_id, action_id, date_added, points)
            values (CAST($userId AS UUID), $actionId, now(), $points)""".execute()
      }
    }
  }
}
