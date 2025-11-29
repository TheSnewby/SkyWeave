#pragma once
#include "simulator.h"

// Currently Centralized

class SwarmCoordinator {
private:
	UAVSimulator& sim;
	std::mutex coord_mutex;

public:
	SwarmCoordinator(UAVSimulator s, formation num = RANDOM) : sim(s) {};

	// getters
	UAVSimulator& get_sim() { return sim; }


	// updaters
	

};