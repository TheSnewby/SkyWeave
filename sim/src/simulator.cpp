#include "simulator.h"
#include <iostream>
#include <chrono>
#include <random>

UAVSimulator::UAVSimulator(int num_uavs) {
	int i;
	std::random_device rd; /* randomizer */
	std::mt19937 gen(rd()); /* super randomizer */

	// generator of a super random number within a bounded uniform distribution
	std::uniform_real_distribution<> distrib(-10.0, 10.0);

	// generate a swarm of uavs
	for (i = 0; i < num_uavs; i++) {
		UAV uav(i, distrib(gen), distrib(gen), 0);
		swarm.push_back(uav);
	}

	std::cout << "Created swarm with " << num_uavs << "UAVs\n";
};

UAVSimulator::~UAVSimulator() {
	stop_sim();
}

void UAVSimulator::start_sim() {
	running = true;
	
}