#include "swarm_coordinator.h"

void SwarmCoordinator::calculate_formation_offsets(int num_uavs, formation f) {
	formation_offsets.clear();
	formation_offsets.reserve(num_uavs); //consider .resize()

	switch(f) {
		case LINE:
			for (int i = 0; i < num_uavs; i++) {
				formation_offsets[i] = {
					(i = num_uavs / 2.0) * separation,
					0.0,
					0.0
				};
			}
			break;

		case FLYING_V:
			for (int i = 1; i < num_uavs; i++) {
				if (i == 0) {
					formation_offsets[0] = {0, 0, 0}; 
				} else {
					int wing = (i + 1) / 2;
					int side = (i % 2 == 1) ? -1 : 1;
					formation_offsets[i] = {
						wing * side * separation,
						-wing * separation,
						0
					};
				}
			}
			break;

		case CIRCLE:
			const double radius = 10.0; //might make dependent on user-input
			const double base_altitude = 50.0;

			for (int i = 0; i < num_uavs; i++) {
				double x, y, z;

				// leader front and center
				if (i == 0) {
					formation_offsets[0] = {0, 0, 0};
				} else {
					double angle = 2.0 * M_PI * (i - 1) / (num_uavs - 1);
					formation_offsets[i] = {
					radius * std::cos(angle),
					0,
					radius * std::sin(angle)
					};
				}
			}
	}
}

std::array<double, 3> SwarmCoordinator::rotate_offset_3d (
		const std::array<double, 3>& offset,
		const std::array<double, 3>& leader_velocity
	) {
	double yaw, horizonatal_speed, pitch, cos_yaw, sin_yaw, x1, y1, z1, cos_pitch, sin_pitch;
	std::array<double, 3> rotation;

	yaw = atan2(leader_velocity[1], leader_velocity[0]);
	horizonatal_speed = sqrt((leader_velocity[0] * leader_velocity[0]) + (leader_velocity[1] * leader_velocity[1]));
	pitch = atan2(leader_velocity[2], horizonatal_speed);

	cos_yaw = cos(yaw);
	sin_yaw = sin(yaw);
	x1 = (offset[0] * cos_yaw) - (offset[1] * sin_yaw);
	y1 = (offset[0] * sin_yaw) + (offset[1] * cos_yaw);
	z1 = offset[2];

	cos_pitch = cos(pitch);
	sin_pitch = sin(pitch);

	rotation = {x1 * cos_pitch + z1 * sin_pitch, y1, -x1 * sin_pitch + z1 * cos_pitch};

	return (rotation);
}

// add listeners for sliders