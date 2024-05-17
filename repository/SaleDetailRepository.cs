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
            //Console.WriteLine("Id = " + saleMasterId);
            // fetch all
            List<SaleDetail> saleDetails = await _db.SaleDetails.ToListAsync();



            SaleDetail filterSaleDetail = await _db.SaleDetails.FirstOrDefaultAsync(s => s.SaleMasterId == saleMasterId);
            //Console.WriteLine(filterSaleDetail);
            if (filterSaleDetail != null)
            {
                await _db.SaleDetails.Where(s => s.SaleMasterId == saleMasterId).ExecuteDeleteAsync();
                return filterSaleDetail;
            }
            else
            {
                //Console.WriteLine("hi");
                return null;
            }

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
