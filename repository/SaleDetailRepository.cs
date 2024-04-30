using DotNetCoreInventoryDashboard.dtos.Product;
using DotNetCoreInventoryDashboard.dtos.SaleDetail;
using DotNetCoreInventoryDashboard.interfaces;
using DotNetCoreInventoryDashboard.models;
using Microsoft.EntityFrameworkCore;

namespace DotNetCoreInventoryDashboard.repository
{
    public class SaleDetailRepository(models.DotNetCoreInventoryDashboardDB dotNetCoreInventoryDashboardDB) : ISaleDetail
    {
        private readonly models.DotNetCoreInventoryDashboardDB _db = dotNetCoreInventoryDashboardDB;
        public async Task<SaleDetail> CreateAsync(SaleDetail saleDetail)
        {
            await _db.SaleDetails.AddAsync(saleDetail);
            await _db.SaveChangesAsync();
            return saleDetail;
        }

        public async Task<SaleDetail?> DeleteAsync(int saleMasterId)
        {
            Console.WriteLine("Id = " + saleMasterId);
            // fetch all
            //List<SaleDetail> saleDetails = await _db.SaleDetails.ToListAsync();



            //SaleDetail filterSaleDetail = await _db.SaleDetails.FirstOrDefaultAsync(s => s.SaleMasterId == saleMasterId);
            //if (filterSaleDetail != null)
            //{
            //    _db.Remove(filterSaleDetail);
            //}


            //await _db.SaveChangesAsync();

            await _db.SaleDetails.Where(s=>s.SaleMasterId==saleMasterId).ExecuteDeleteAsync();
            //List<SaleDetail> saleDetail = await _db.SaleDetails.FindAsync(id);
            //if (saleDetail == null)
            //{
            //    return null;
            //}
            //foreach (var item in saleDetail)
            //{

            //}
            //_db.Remove(saleDetail);
            //await _db.SaveChangesAsync();
            //return saleDetail;
            return null;
        }

        public async Task<List<SaleDetail>> GetAllAsync()
        {
            return await _db.SaleDetails.ToListAsync();
        }

        public async Task<SaleDetail?> GetByIdAsync(int id)
        {
            return await _db.SaleDetails.FindAsync(id);
        }

        public async Task<SaleDetail> UpdateAsync(int id, CreateUpdateSaleDetailDto createUpdateSaleDetailDto)
        {
            var saleDetail = await _db.SaleDetails.FirstOrDefaultAsync(x => x.SaleMasterId == id);
            if (saleDetail == null)
            {
                return null;
            }
            saleDetail.SaleMasterId = id;
            saleDetail.ProductId = createUpdateSaleDetailDto.ProductId;
            saleDetail.Qty = createUpdateSaleDetailDto.Qty;
            saleDetail.Rate = createUpdateSaleDetailDto.Rate;
            saleDetail.AmountPerProduct = createUpdateSaleDetailDto.AmountPerProduct;
            await _db.SaveChangesAsync();
            return saleDetail;
        }

    }
}
