import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UsePipes, ValidationPipe } from "@nestjs/common";
import { Auth } from "src/auth/decorators/auth.decorator";
import { CurrentUser } from "src/auth/decorators/user.decorator";
import { TimeBlockService } from "./time-block.service";
import { TimeBlockDto } from "./dto/time-block.tdo";
import { UpdateOrderDto } from "./dto/update-order.dto";


@Controller('user/time-blocks')

export class TimeBlockController {
constructor(private readonly timeBlockService: TimeBlockService){}
    @Get()
    @Auth()
    async getAll(@CurrentUser('id') userId: string) {
        return this.timeBlockService.getAll(userId)
    }

    
    @UsePipes(new ValidationPipe())
    @Post()
    @HttpCode(200)
    @Auth()
    async create(@Body() dto: TimeBlockDto, @CurrentUser("id") userId: string) {
        return this.timeBlockService.createTimeBlock(dto, userId)
    }
    @UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put('update-order')
	@Auth()
	updateOrder(@Body() updateOrderDto: UpdateOrderDto) {
		return this.timeBlockService.updateOrder(updateOrderDto.ids)
	}

    @UsePipes(new ValidationPipe())
    @Put(":id")
    @HttpCode(200)
    @Auth()
    async update(@Body() dto:TimeBlockDto, @CurrentUser('id') userId: string, @Param("id") id: string) {
        return this.timeBlockService.updateTimeBlock(dto, id, userId)
    }

    @HttpCode(200)
    @Delete(":id")
    @Auth()
    async delete(@Param('id') id: string, @CurrentUser("id") userId: string) {
        return this.timeBlockService.deleteTimeBlock(id, userId)
    }

} 