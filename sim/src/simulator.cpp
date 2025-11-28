#include "simulator.h"

/**
 * print_swarm_status: prints all UAV's position and velocity to stdout
 */
void UAVSimulator::print_swarm_status() {
	size_t swarm_size = swarm.size();

	std::cout << std::fixed << std::setprecision(2);
	std::cout << "\nPrinting current swarm.\n" << std::endl;
	std::cout <<"ID: Position X, Y, Z. Velocity: vx, vy, vz" << std::endl;

	for (size_t i = 0; i < swarm_size; i++)
	{
		std::cout << swarm[i].get_id() << ": Position " << swarm[i].get_x() <<
		", " << swarm[i].get_y() << ", " << swarm[i].get_z() << ". Velocity: " <<
		swarm[i].get_velx() << ", " << swarm[i].get_vely() << ", " << swarm[i].get_velz() << std::endl; 
	}
};

/**
 * Constructor for UAVSimulator
 */
UAVSimulator::UAVSimulator(int num_uavs) {
	int i;
	const double spacing = 10.0;
	const double base_altitude = 50.0;

	for (i = 0; i < num_uavs; i++) {
		double x, y, z;

		// leader front and center
		if (i == 0) {
			x = 0.0;
			z = 0.0;
		} else {
			// VEE formation - two per wing
			int wing = (i + 1) / 2;              // 1,1,2,2,...
			int side = (i % 2 == 1) ? -1 : 1;    // left/right

			x = side * wing * spacing;          // horizontal offset
			z = wing * spacing;                 // distance behind leader
		}

		y = base_altitude;

		int uav_port = 8000 + i;
		UAV uav(i, uav_port, x, y, z);
		swarm.push_back(uav);
	}

	std::cout << "Created swarm with " << num_uavs << " UAVs" << std::endl;
	print_swarm_status();
};

/**
 * ~UAVSimulator - Destructor for UAVSimulator
 */
UAVSimulator::~UAVSimulator() {
	stop_sim();
}

/**
 * update_uav_pos - updates and broadcasts to the telemetry server
 */
void update_uav_pos(int index, int dt, int tel_serv_port) {
	
}
/**
 * start_sim -	starts the simulation loop in a separate thread,
 *				updating UAV positions and sending telemetry to server
 */
void UAVSimulator::start_sim() {
	if (running)
		return;

	running = true;

	std::thread([this]() {
		using namespace std::chrono;
		const double dt_seconds = 0.05;                  // 50 ms time step
		const auto sleep_duration = milliseconds(50);    // 20 updates per second
		const int telemetry_port = 6000;

		while (running) {
			for (auto &uav : swarm) {
				uav.update_position(dt_seconds);
				uav.uav_to_telemetry_server(telemetry_port);
			}

			std::this_thread::sleep_for(sleep_duration);
		}
	}).detach();
}

void UAVSimulator::stop_sim() {
	running = false;

}