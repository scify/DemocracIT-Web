package model.services

import java.util.UUID

import model.repositories.UserProfileRepository
import model.viewmodels.UserProfileViewModel


class UserProfileManager {
  def get(userId:UUID) :UserProfileViewModel = {
    val userProfileRepository = new UserProfileRepository
    UserProfileViewModel(user = userProfileRepository.findUserById(userId), totalUserPoints = userProfileRepository.getTotalPointsForUser(userId))
  }

}
