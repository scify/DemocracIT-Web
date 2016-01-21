package model.services

import java.util.UUID

import model.repositories.UserProfileRepository
import model.viewmodels.UserProfileViewModel


class UserProfileManager {

  /** Function which returns the user object as view model
    * @param userId user id
    */
  def get(userId:UUID) :UserProfileViewModel = {
    val userProfileRepository = new UserProfileRepository
    UserProfileViewModel(user = userProfileRepository.findUserById(userId), totalUserPoints = userProfileRepository.getTotalPointsForUser(userId))
  }

  /** Function which returns the user full name based on user id
    * @param userId user id
    */
  def getUserFullNameById(userId:UUID):String = {
    var userFullName = ""
    val userProfileRepository = new UserProfileRepository()
    userFullName = userProfileRepository.getUserFullNameById(userId)
    userFullName
  }

}
