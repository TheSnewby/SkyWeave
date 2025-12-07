#pragma once
#include "uav.h"
#include <vector>
#include <array>
#include <cmath>
#include <thread>

class UAV; // forward declaration to avoid circular header dependencies

class Pathfollower {
private:
	UAV& leader;
	std::vector<std::array<double, 3>> waypoints;
	int currentIndex = 0;
	double lookahead = 10.0;
	double tolerance;
	double resolution;


public:
	Pathfollower(UAV& leader_, double resolution_) : leader(leader_), resolution(resolution_) {};

	//getter

	//setter
	void setLookahead(double lookahead_)	{ lookahead = lookahead_; }
	void setTolerance(double tolerance_)	{ tolerance = tolerance_; }

private:
	void simplifyPath(const std::vector<std::array<double, 3>>& raw);
	std::array<double, 3> computeCarrot() const;
};