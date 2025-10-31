import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { QueueModule } from "../queue/queue.module";
import { User } from "../user/entities";
import { WebThreeModule } from "../web-three/web-three.module";
import { OrganizationController } from "./controllers";
import { Organization, OrganizationMember, OrganizationRegistration } from "./entities";
import { OrganizationRegistrationService, OrganizationService, OrganizationTrackerService } from "./services";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrganizationRegistration,
      Organization,
      OrganizationMember,
      User
    ]),
    forwardRef(() => QueueModule),
    forwardRef(() => WebThreeModule),
  ],
  controllers: [OrganizationController],
  providers: [
    OrganizationService,
    OrganizationRegistrationService,
    OrganizationTrackerService
  ],
  exports: [
    OrganizationTrackerService
  ],
})
export class OrganizationModule { }