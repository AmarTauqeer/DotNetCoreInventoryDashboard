using DotNetCoreInventoryDashboard.dtos.PurchaseMaster;
using DotNetCoreInventoryDashboard.models;
using DotNetCoreInventoryDashboard.interfaces;
using Microsoft.EntityFrameworkCore;

namespace DotNetCoreInventoryDashboard.repository
{
    public class PurchaseMasterRepository(models.DotNetCoreInventoryDashboardDB dotNetCoreInventoryDashboardDB) : IPurchaseMaster
    {
        private readonly models.DotNetCoreInventoryDashboardDB _db = dotNetCoreInventoryDashboardDB;
        public async Task<PurchaseMaster> CreateAsync(PurchaseMaster purchaseMaster)
        {
            await _db.PurchaseMasters.AddAsync(purchaseMaster);
            await _db.SaveChangesAsync();
            return purchaseMaster;
        }

        public async Task<PurchaseMaster?> DeleteAsync(int id)
        {
            var purchaseMaster = await _db.PurchaseMasters.FirstOrDefaultAsync(x => x.PurchaseMasterId == id);
            if (purchaseMaster == null)
            {
                return null;
            }
            _db.Remove(purchaseMaster);
            await _db.SaveChangesAsync();
            return purchaseMaster;
        }

        public async Task<List<PurchaseMaster>> GetAllAsync()
        {
            return await _db.PurchaseMasters.Include(d => d.PurchaseDetails).ToListAsync();
        }

        public async Task<PurchaseMaster?> GetByIdAsync(int id)
        {
            return await _db.PurchaseMasters.Include(d => d.PurchaseDetails).FirstOrDefaultAsync(i => i.PurchaseMasterId == id);
        }

        public async Task<PurchaseMaster?> UpdateAsync(int id, CreateUpdatePurchaseMasterDto createUpdatePurchaseMasterDto)
        {
            var purchaseMaster = await _db.PurchaseMasters.FirstOrDefaultAsync(x => x.PurchaseMasterId == id);
            if (purchaseMaster == null)
            {
                return null;
            }
            purchaseMaster.PurchaseMasterId = id;
            purchaseMaster.PurchaseAmount = createUpdatePurchaseMasterDto.PurchaseAmount;
            purchaseMaster.CreateAt = createUpdatePurchaseMasterDto.CreateAt;
            purchaseMaster.SupplierId = createUpdatePurchaseMasterDto.SupplierId;

            await _db.SaveChangesAsync();
            return purchaseMaster;
        }
    }
}
