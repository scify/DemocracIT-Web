package model.repositories

import java.util.UUID

import _root_.anorm._
import play.api.Play.current
import play.api.db.DB


class GamificationRepository {

  def savePoints(userId:UUID, actionId:Int, points:Int):Unit = {
    DB.withConnection { implicit c =>
      SQL"""
            INSERT INTO user_awards (user_id, action_id, date_added, points)
            select CAST($userId AS UUID), $actionId, now(), $points)""".execute()
    }
  }

  def getTotalPointsForUser(userId:UUID):Int = {
    DB.withConnection { implicit c =>
      val result:Int = SQL"""
            select sum(points) as total_points from user_awards
            where user_id = $userId
            """.as(SqlParser.int("total_points"))
      result
    }

  }
}
