#pragma once
#include "simulator.h"

enum formation {
	RANDOM = 0,
	ORTHOGONAL_LINE,
	FLYING_V,
	STAGGERED,
};

// Currently Centralized

class SwarmCoordinator {
private:
	UAVSimulator& sim;
	formation form;
	std::mutex coord_mutex;

public:
	SwarmCoordinator(UAVSimulator s, formation num = RANDOM) : sim(s), form(num) {};

	// getters
	UAVSimulator& get_sim() { return sim; }
	formation get_formation() { return form; }

	// setters
	void set_formation(formation f) { form = f; }

	// updaters
	

};