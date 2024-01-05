import { Query, Resolver } from '@nestjs/graphql';
import { AppService } from './app.service';

@Resolver()
export class AppResolver {
    constructor(private readonly appService: AppService) { }

    @Query(() => String)
    dummy(): string {
        return this.appService.getHello()
    }
}
