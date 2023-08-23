import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from '../_common/dtos/create-product.dto';
import { UpdateProductDto } from '../_common/dtos/update-product.dto';
import { IMessage } from 'src/_common/interfaces/message.interface';
import { Product } from 'src/_common/entities';
import { SearchProductDto } from 'src/_common/dtos/search-product.dto';
import { AuthGuard } from 'src/_common/guards/auth.guard';
import { IRequest } from 'src/_common/interfaces/request.interface';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // 상품 추가
  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() product: CreateProductDto, @Req() req): Promise<IMessage> {
    const memberId = 32;
    const smallCategoryId = 24;
    const productImages = req.files.length ? req.files.map((file) => file.location) : null;
    await this.productService.create(product, productImages, memberId, smallCategoryId);
    return { message: '상품이 추가되었습니다.' };
  }

  // 상품 전체 조회
  @Get()
  async findAll(): Promise<Product[]> {
    return await this.productService.findAll();
  }

  // 내 상품 조회
  @UseGuards(AuthGuard)
  @Get('my-products')
  async findByMemberId(@Req() req: IRequest): Promise<Product[]> {
    const { id } = req.user;
    return await this.productService.findByMemberId(id);
  }

  // 상품 검색
  @Get('search')
  async search(@Query() search: SearchProductDto): Promise<Product[]> {
    return await this.productService.search(search);
  }

  // 찜한 상품 조회
  @UseGuards(AuthGuard)
  @Get('picks')
  async getPickedProducts(@Req() req: IRequest) {
    const { id } = req.user;
    return await this.productService.findPickedProducts(id);
  }

  // 상품 조회
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Product> {
    return await this.productService.findOne(id);
  }

  // 상품 수정
  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto): Promise<IMessage> {
    return await this.productService.update(id, updateProductDto);
  }

  // 상품 삭제
  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<IMessage> {
    return await this.productService.remove(id);
  }
}