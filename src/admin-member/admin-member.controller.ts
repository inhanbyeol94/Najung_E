import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { AdminMemberService } from './admin-member.service';
import { IMessage } from '../_common/interfaces/message.interface';
import { UpdateAdminMemberDto } from '../_common/dtos/updateAdminMember.dto';

@Controller('admin-members')
export class AdminMemberController {
  constructor(private adminMemberService: AdminMemberService) {}

  // @Get()

  // @Post()

  @Patch('/:id')
  @HttpCode(200)
  async updateAdminMember(@Param('id') id: number, @Body() data: UpdateAdminMemberDto): Promise<IMessage> {
    return await this.adminMemberService.updateAdminMember(id, data.name, data.nickname, data.password, data.tel, data.address, data.isAdmin);
  }

  // @Delete()
}